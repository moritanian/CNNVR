# CNNVR
WebVR with CNN depth prediction

## Introduction
In the backend, [CNN depth prediction](https://github.com/iro-cp/FCRN-DepthPrediction) create depth map from the web camera images.
In the front end,  it shows 3d movie.

## Usage
### environment (recommended)
python3.5
opencv-python 3.4
tensorflow-gpu 1.4


### Get the trained model
As written in [CNN depth prediction](https://github.com/iro-cp/FCRN-DepthPrediction), download the TensorFlow trained model and place it in `models/`.
If `NYU_FCRN.ckpt` does not exist and `NYU_FCRN.ckpt.xxx` exists, rename it to `NYU_FCRN.ckpt`.

### Run the backend script 
```
python predict.py ./models/NYU_FCRN.ckpt 
```

### Front end
Run the web server and check the `html/index.html`!
