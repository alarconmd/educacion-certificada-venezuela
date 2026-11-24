"""Alias de compatibilidad; la implementación vive en build/validate.py."""
from pathlib import Path
import runpy

runpy.run_path(str(Path(__file__).resolve().parents[1] / "validate.py"), run_name="__main__")
