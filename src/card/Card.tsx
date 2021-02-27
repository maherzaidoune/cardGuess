import React from 'react'
import { View, Dimensions, Image, ActivityIndicator } from 'react-native'
import axios from 'axios'

const ITEM_WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = Dimensions.get('window').height * 0.6;

const Card = ({url, loading}: {url: String, loading: boolean}) => {    
    
    if(loading || url === null) 
    return (
        <View style={{
            backgroundColor: '#fff',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: ITEM_HEIGHT,
            width: ITEM_WIDTH,
        }}>
            <ActivityIndicator color={'red'} />
        </View>
    );

    return (
           <Image 
                style={{
                    height: '70%',
                    width: '80%',
                }}
                source={{
                    uri: url,
                }}
                resizeMode={'contain'}
                />
    )
}

export default React.memo(Card);
