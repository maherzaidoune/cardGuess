import React, { useEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import axios from 'axios'

const Card = ({url}: {url: String}) => {    
    
    if(url === null) return <View style={{
        height: '70%',
        width: '80%',
    }}>
        <ActivityIndicator color={'red'} />
    </View>;

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
