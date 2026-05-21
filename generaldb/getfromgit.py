from pathlib import Path
import os
import subprocess

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

def ddfile(repo, name):
    savepath = f"userdata/{name}"

    #check if exists
    if os.path.exists(savepath):
        return savepath

    subprocess.run(
        [
            "git",
            "clone",
            "--depth", "1",
            "--filter = blob: none",
            "--sparse",
            repo,
            savepath
        ],
        check = True
    )
    subprocess.run(
        [
            "git",
            "-C",
            savepath,
            "sparse-checkout",
            "set",
            name,
        ],
        check = True
    )

    return f"{savepath}/{name}"