#!/usr/bin/env bash
# GitHub environment detection helper. Usage: source this file.
# Sets: GH_AUTH_METHOD (gh|curl|none), GITHUB_TOKEN, GH_USER, GH_OWNER, GH_REPO, GH_OWNER_REPO
GH_AUTH_METHOD="none"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
GH_USER=""
_here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
    GH_AUTH_METHOD="gh"
    GH_USER=$(gh api user --jq '.login' 2>/dev/null)
elif [ -n "$GITHUB_TOKEN" ]; then
    GH_AUTH_METHOD="curl"
elif [ -f "$HOME/.git-credentials" ]; then
    GITHUB_TOKEN=$(python3 "$_here/git-credential-token.py")
    [ -n "$GITHUB_TOKEN" ] && GH_AUTH_METHOD="curl"
fi
if [ "$GH_AUTH_METHOD" = "curl" ] && [ -z "$GH_USER" ]; then
    GH_USER=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user 2>/dev/null \
        | python3 -c "import sys,json; print(json.load(sys.stdin).get('login',''))" 2>/dev/null)
fi
GH_OWNER=""; GH_REPO=""; GH_OWNER_REPO=""
_remote_url=$(git remote get-url origin 2>/dev/null)
if [ -n "$_remote_url" ] && echo "$_remote_url" | grep -q "github.com"; then
    GH_OWNER_REPO=$(echo "$_remote_url" | sed -E 's|.*github\.com[:/]||; s|\.git$||')
    GH_OWNER=${GH_OWNER_REPO%%/*}; GH_REPO=${GH_OWNER_REPO#*/}
fi
unset _remote_url _here
echo "GitHub Auth: $GH_AUTH_METHOD"
[ -n "$GH_USER" ] && echo "User: $GH_USER"
[ -n "$GH_OWNER_REPO" ] && echo "Repo: $GH_OWNER_REPO"
[ "$GH_AUTH_METHOD" = "none" ] && echo "Not authenticated - see references/auth.md"
export GH_AUTH_METHOD GITHUB_TOKEN GH_USER GH_OWNER GH_REPO GH_OWNER_REPO
