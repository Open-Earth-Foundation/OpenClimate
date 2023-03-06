import zipfile
import urllib.request
import tempfile
from pathlib import Path
from zipfile import ZipFile

def download_and_expand_zipfile(url):
    fname = Path(tempfile.gettempdir()) / Path(next(tempfile._get_candidate_names()) + ".zip")
    urllib.request.urlretrieve(url, fname)
    zipdir = tempfile.mkdtemp()
    with ZipFile(fname) as code: code.extractall(zipdir)
    fname.unlink()
    return zipdir

if __name__ == "__main__":
    import sys
    url = sys.argv[1]
    dirname = download_and_expand_zipfile(url)
    print(dirname)