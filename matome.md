## MINGW
source activate cuda-env

python ws_server.py

python predict.py ./models/NYU_FCRN.ckpt 