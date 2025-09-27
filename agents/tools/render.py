from __future__ import annotations

import os
import urllib.request
from dataclasses import dataclass


@dataclass
class DeployResult:
    status_code: int
    response_body: str


def trigger_deploy(site_slug: str) -> DeployResult:
    hook_env = f"RENDER_DEPLOY_HOOK_{site_slug.upper().replace('-', '_')}"
    hook_url = os.environ.get(hook_env)
    if not hook_url:
        msg = f"Deploy hook not configured for {site_slug}; set {hook_env}."
        raise RuntimeError(msg)
    with urllib.request.urlopen(hook_url) as response:  # nosec B310
        body = response.read().decode()
        return DeployResult(status_code=response.status, response_body=body)
