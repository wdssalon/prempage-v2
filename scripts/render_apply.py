#!/usr/bin/env python3
"""Sync Render static-site settings from a blueprint-style YAML file."""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Any, Dict, List, Optional

try:
    import requests
    import yaml
except ImportError as error:  # pragma: no cover - handled at runtime
    sys.exit("Install dependencies first: pip install pyyaml requests")

API_ROOT = os.environ.get("RENDER_API_URL", "https://api.render.com/v1")


def die(message: str) -> None:
    sys.exit(message)


def auth_headers() -> Dict[str, str]:
    api_key = os.environ.get("RENDER_API_KEY")
    if not api_key:
        die("RENDER_API_KEY is required")
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def api(method: str, path: str, **kwargs: Any) -> requests.Response:
    response = requests.request(
        method,
        f"{API_ROOT}{path}",
        headers=auth_headers(),
        timeout=30,
        **kwargs,
    )
    if response.status_code == 401:
        die("Unauthorized (401). Check RENDER_API_KEY.")
    response.raise_for_status()
    return response

def list_services(service_type: Optional[str] = None, name: Optional[str] = None) -> List[Dict[str, Any]]:
    params: Dict[str, Any] = {}
    if service_type:
        params["type"] = service_type
    if name:
        params["name"] = name

    payload = api("GET", "/services", params=params).json()
    items: List[Dict[str, Any]] = []

    if isinstance(payload, list):
        source = payload
    else:
        source = payload.get("data", [])

    for entry in source:
        if isinstance(entry, dict) and "service" in entry:
            items.append(entry["service"])
        else:
            items.append(entry)

    return items

def get_service_by_name(name: str, service_type: Optional[str] = None) -> Dict[str, Any]:
    services = list_services(service_type=service_type, name=name)
    matches = [service for service in services if service.get("name") == name]
    if not matches:
        die(f"Service '{name}' not found.")
    if len(matches) > 1:
        die(f"Multiple services named '{name}' found; use unique names.")
    return matches[0]

def patch_service(service_id: str, payload: Dict[str, Any], *, dry_run: bool = False) -> None:
    if not payload:
        return
    if dry_run:
        print(json.dumps({"PATCH": f"/services/{service_id}", "payload": payload}, indent=2))
        return
    api("PATCH", f"/services/{service_id}", json=payload)

def replace_env_vars(
    service_id: str,
    env_vars: List[Dict[str, str]],
    *,
    dry_run: bool = False,
) -> None:
    if env_vars is None:
        return
    # The API expects just an array, not wrapped in envVars
    body = [{"key": var["key"], "value": str(var.get("value", ""))} for var in env_vars]
    if dry_run:
        print(json.dumps({"PUT": f"/services/{service_id}/env-vars", "payload": body}, indent=2))
        return
    api("PUT", f"/services/{service_id}/env-vars", json=body)

def trigger_deploy(service_id: str, *, dry_run: bool = False) -> None:
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
    services = load_yaml_blueprint(path)
    for svc in services:
        name = svc["name"]
        print(f"Applying to service: {name}")
        remote = get_service_by_name(name, service_type=None)  # API uses generic /services
        payload = build_update_payload(svc)
        patch_service(remote["id"], payload, dry_run=dry_run)
        # Env vars in Blueprint live under envVars
        env_vars = svc.get("envVars") or []
        if env_vars:
            replace_env_vars(remote["id"], env_vars, dry_run=dry_run)
        if deploy:
            trigger_deploy(remote["id"], dry_run=dry_run)

def main(argv: Optional[List[str]] = None) -> None:
    ap = argparse.ArgumentParser(description="Sync static-site settings to Render")
    ap.add_argument("yaml_path", nargs="?", help="Path to render.yaml-like file")
    ap.add_argument("--deploy", action="store_true", help="Trigger a deploy after updates")
    ap.add_argument("--dry-run", action="store_true", help="Print requests without sending")
    ap.add_argument("--list", action="store_true", help="List available services and exit")
    args = ap.parse_args(argv)
    if args.list:
        services = list_services()
        if not services:
            print("No services found")
            return
        for service in services:
            print(f"{service.get('name')} (id={service.get('id')})")
        return

    if not args.yaml_path:
        die("YAML path is required unless --list is supplied")

    apply(args.yaml_path, deploy=args.deploy, dry_run=args.dry_run)

if __name__ == "__main__":
    main()
