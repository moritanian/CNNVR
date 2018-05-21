import argparse
import os
import numpy as np
import tensorflow as tf
from matplotlib import pyplot as plt
from PIL import Image
import cv2

import models
from ws_sender import WSSender


def predict(model_data_path):

    sender = WSSender()

    # Default input size
    height = 228
    width = 304
    channels = 3
    batch_size = 1
   
    # Read image
    cap = cv2.VideoCapture(0) # 0はカメラのデバイス番号
   
    # Create a placeholder for the input image
    input_node = tf.placeholder(tf.float32, shape=(None, height, width, channels))

    # Construct the network
    net = models.ResNet50UpProj({'data': input_node}, batch_size, 1, False)
        
    with tf.Session() as sess:

        # Load the converted parameters
        print('Loading the model')

        # Use to load from ckpt file
        saver = tf.train.Saver()     
        saver.restore(sess, model_data_path)

        while (True):
            ret, frame = cap.read()

            #img = frame.resize([width,height], Image.ANTIALIAS)
            img = cv2.resize(frame, (width, height))
            
            cv2.imshow('camera capture', img)

           
            img = np.array(img).astype('float32')
            img = np.expand_dims(np.asarray(img), axis = 0)
            pred = sess.run(net.get_output(), feed_dict={input_node: img})
            
            img = pred[0, :, :,0] /2.0
            #print(pred.shape) # (1,128, 160, 1)
            #print(img.shape) # (128 160)
            cv2.imshow('camera depth', img)

            cimg = cv2.resize(frame, (160, 128));

            sender.send(img, cimg)

            #ii = plt.imshow(pred[0,:,:,0], interpolation='nearest')
            #fig.colorbar(ii)
            #plt.show()
            
            k = cv2.waitKey(1) # 1msec待つ
            if k == 27: # ESCキーで終了
                break
        
        cap.release()
        cv2.destroyAllWindows()


            

        return pred
        
                
def main():
    # Parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('model_path', help='Converted parameters for the model')
    args = parser.parse_args()

    # Predict the image
    pred = predict(args.model_path)
    
    os._exit(0)

if __name__ == '__main__':
    main()

        



