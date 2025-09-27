#!/usr/bin/env python3
"""
Sync Render static-site settings from a Blueprint-like YAML (subset).
- Reads services of type: web with runtime: static
- Applies buildCommand, staticPublishPath, rootDir, branch (if present)
- Replaces env vars (careful: destructive)
- Can trigger a deploy
"""
from __future__ import annotations
import argparse, json, os, sys
from typing import Any, Dict, List, Optional

try:
    import yaml  # pip install pyyaml
    import requests  # pip install requests
except ImportError as e:
    sys.exit("Install deps first: pip install pyyaml requests")

API_ROOT = os.environ.get("RENDER_API_URL", "https://api.render.com/v1")
API_KEY = os.environ.get("RENDER_API_KEY")
HDRS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def die(msg: str) -> None:
    sys.exit(msg)

def api(method: str, path: str, **kw) -> requests.Response:
    r = requests.request(method, f"{API_ROOT}{path}", headers=HDRS, timeout=30, **kw)
    if r.status_code == 401:
        die("Unauthorized (401). Check RENDER_API_KEY.")
    r.raise_for_status()
    return r

def list_services(service_type: Optional[str] = None, name: Optional[str] = None) -> List[Dict[str, Any]]:
    params: Dict[str, Any] = {}
    if service_type:
        params["type"] = service_type
    if name:
        params["name"] = name
    r = api("GET", "/services", params=params)
    payload = r.json()
    # Extract the actual service objects from the nested structure
    if isinstance(payload, list):
        services = []
        for item in payload:
            if "service" in item:
                services.append(item["service"])
            else:
                services.append(item)
        return services
    else:
        data = payload.get("data", [])
        services = []
        for item in data:
            if "service" in item:
                services.append(item["service"])
            else:
                services.append(item)
        return services

def get_service_by_name(name: str, service_type: Optional[str] = None) -> Dict[str, Any]:
    svcs = list_services(service_type=service_type, name=name)
    matches = [s for s in svcs if s.get("name") == name]
    if not matches:
        die(f"Service '{name}' not found.")
    if len(matches) > 1:
        die(f"Multiple services named '{name}' found; use unique names.")
    return matches[0]

def patch_service(service_id: str, payload: Dict[str, Any], dry_run=False) -> None:
    if not payload:
        return
    if dry_run:
        print(json.dumps({"PATCH": f"/services/{service_id}", "payload": payload}, indent=2))
        return
    api("PATCH", f"/services/{service_id}", json=payload)

def replace_env_vars(service_id: str, env_vars: List[Dict[str, str]], dry_run=False) -> None:
    if env_vars is None:
        return
    # The API expects just an array, not wrapped in envVars
    body = [{"key": v["key"], "value": str(v.get("value", ""))} for v in env_vars]
    if dry_run:
        print(json.dumps({"PUT": f"/services/{service_id}/env-vars", "payload": body}, indent=2))
        return
    api("PUT", f"/services/{service_id}/env-vars", json=body)

def trigger_deploy(service_id: str, dry_run=False) -> None:
    if dry_run:
        print(json.dumps({"POST": f"/services/{service_id}/deploys", "payload": {}}, indent=2))
        return
    api("POST", f"/services/{service_id}/deploys", json={})

def load_yaml_blueprint(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or {}
    services = data.get("services") or []
    # Keep only static sites in Blueprint terms: type: web + runtime: static
    static_sites = [s for s in services if s.get("type") == "web" and s.get("runtime") == "static"]
    if not static_sites:
        die("No static sites found in YAML (expect type: web, runtime: static).")
    return static_sites

def build_update_payload(svc: Dict[str, Any]) -> Dict[str, Any]:
    # Map Blueprint keys -> Service API fields
    payload: Dict[str, Any] = {}
    if "buildCommand" in svc and svc["buildCommand"] is not None:
        payload["buildCommand"] = svc["buildCommand"]
    # Blueprint uses staticPublishPath
    if "staticPublishPath" in svc and svc["staticPublishPath"] is not None:
        payload["publishPath"] = svc["staticPublishPath"]
    # Monorepo root
    if "rootDir" in svc:
        payload["rootDir"] = svc["rootDir"]
    # Optional branch pinning
    if "branch" in svc and svc["branch"]:
        payload["branch"] = svc["branch"]
    return payload

def apply(path: str, deploy: bool, dry_run: bool) -> None:
    if not API_KEY:
        die("RENDER_API_KEY is required")
    blue = load_yaml_blueprint(path)
    for svc in blue:
        name = svc["name"]
        print(f"Applying to service: {name}")
        remote = get_service_by_name(name, service_type=None)  # API uses generic /services
        payload = build_update_payload(svc)
        patch_service(remote["id"], payload, dry_run=dry_run)
        # Env vars in Blueprint live under envVars
        envs = svc.get("envVars") or []
        if envs:
            replace_env_vars(remote["id"], envs, dry_run=dry_run)
        if deploy:
            trigger_deploy(remote["id"], dry_run=dry_run)

def main(argv: Optional[List[str]] = None) -> None:
    ap = argparse.ArgumentParser(description="Sync static-site settings to Render")
    ap.add_argument("yaml_path", help="Path to render.yaml-like file")
    ap.add_argument("--deploy", action="store_true", help="Trigger a deploy after updates")
    ap.add_argument("--dry-run", action="store_true", help="Print requests without sending")
    args = ap.parse_args(argv)
    apply(args.yaml_path, deploy=args.deploy, dry_run=args.dry_run)

if __name__ == "__main__":
    main()
