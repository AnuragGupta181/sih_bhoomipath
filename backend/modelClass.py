import numpy as np
import tensorflow as tf
import pandas as pd
from tensorflow.keras import layers,Model
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder
from itertools import islice



class LCAmodel(Model):
    def __init__(self, input_dim=28, hidden_dim=32,**kwargs):
        super(LCAmodel, self).__init__(**kwargs)
        self.encoder = tf.keras.Sequential([
            layers.Dense(hidden_dim, activation='relu'),
            layers.Dense(hidden_dim, activation='relu')
        ])
        self.decoder = tf.keras.Sequential([
            layers.Dense(input_dim // 2)   
        ])

    def call(self, inputs):
        x, mask = inputs
        x = tf.cast(tf.reshape(x, (1, -1)), tf.float32)        
        mask = tf.cast(tf.reshape(mask, (1, -1)), tf.float32) 
        inp = tf.concat([x, mask], axis=1)  
        h = self.encoder(inp)
        out = self.decoder(h)  
        return out