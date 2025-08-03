import os
import json
import argparse
from typing import Dict, Optional, Set

# 기본 포함 확장자
INCLUDE_EXT: Set[str] = {".tsx"}

def build_tree(path: str, root: str, special_files: Set[str]) -> Optional[Dict]:
    """
    주어진 경로를 재귀적으로 탐색해 .tsx 파일과 special_files 에 해당하는
    파일만 포함한 트리(dict)를 반환한다.
    .tsx / special 파일이 전혀 없는 디렉터리는 트리에서 완전히 제외된다.
    """
    entries = sorted(os.listdir(path))
    files: Dict[str, str] = {}
    dirs: Dict[str, Dict] = {}

    for entry in entries:
        full_path = os.path.join(path, entry)

        if os.path.isdir(full_path):
            subtree = build_tree(full_path, root, special_files)
            if subtree:                 # 하위에 포함할 파일이 있을 때만 추가
                dirs[entry] = subtree
        else:
            rel_path = os.path.relpath(full_path, root)
            ext = os.path.splitext(entry)[1].lower()

            if ext in INCLUDE_EXT or rel_path in special_files:
                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        files[entry] = f.read()
                except Exception as e:
                    files[entry] = f"Error reading file: {e}"

    # 포함할 파일과 디렉터리가 모두 없으면 None
    if not files and not dirs:
        return None

    node: Dict = {}
    if files:
        node["__files__"] = files
    node.update(dirs)
    return node

def save_json(data: Dict, output_file: str) -> None:
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def main(src: str, output: str) -> None:
    if not os.path.isdir(src):
        print(f"에러: '{src}' 디렉터리가 존재하지 않습니다.")
        return

    # 포함해야 하는 특수 파일 (루트 기준 상대 경로)
    special_files: Set[str] = {
        os.path.relpath(__file__, src),   # 현재 파이썬 스크립트
        os.path.join("app", "globals.css")
    }

    tree = build_tree(src, src, special_files)
    if tree is None:
        print("탐색된 .tsx / special 파일이 없습니다.")
        return

    save_json(tree, output)
    print(f"디렉터리 구조가 '{output}'에 저장되었습니다.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=".tsx 파일과 지정 파일을 포함한 Next.js 디렉터리 구조를 JSON으로 저장"
    )
    parser.add_argument("--src", default="./", help="탐색할 루트 디렉터리 (기본: ./)")
    parser.add_argument("--output", default="directory_structure.json", help="출력 JSON 파일명")

    args = parser.parse_args()
    main(args.src, args.output)
