from pathlib import Path

def getfols(repo: str | Path) -> list[str]:
    root = Path(repo).resolve()
    if not root.exists():
        raise FileNotFoundError(f"GIT assets not found")
        
    fols = []
    

    for path in root.rglob("*"):
        if path.is_dir() and ".git" not in path.parts:
            relpath = path.relative_to(root)
            fols.append(str(relpath))
            
    return sorted(fols)