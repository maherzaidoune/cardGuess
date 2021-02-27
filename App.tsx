/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios'
import Carousel from 'react-native-snap-carousel';
import Card from './src/card/Card';

const cards = Array.from(Array(52).keys());
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Dimensions.get('window').height * 0.5;
const values = ['ACE','1','2','3','4','5','6','7','8','9', '10','JACK', 'QUEEN' , 'KING']
const App = () => {

  type Nullable<T> = T | null;

  interface deck {
    success: boolean,
    deck_id: string,
    remaining: number,
    shuffled: boolean,
}

  interface images {
    code: string,
    image:string,
    images: object,
    value: string,
    suit: string,
  }

  interface cardDetails {
    success: Boolean,
    deck_id: string,
    cards: Array<images>,
    remaining: number,
  }


  const [deck, setDeck] = useState<Nullable<deck>>(null)

  const [score, setScore] = useState<number>(0)

  const [loading, setLoading] = useState(false)

  const [currentCard, setcurrentCard] = useState<Nullable<cardDetails>>(null)

  const carousel = useRef(null)

  const renderCard = () => <Card loading={loading} url={currentCard ? currentCard.cards[0].image : ''} />;

  const setUpNewDeck = () => {
    axios.get<deck>(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`).then(res => {
      setDeck(res.data)
      setUpNewCard(res.data.deck_id, null);
    }).catch(e => console.log(e))
  }

  const setUpNewCard = (deckId: string, guess: Nullable<boolean>) => {
    axios.get<cardDetails>(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`).then(res => {
      console.log("Number(res.data.cards[0].value) == ", Number(res.data.cards[0].value) );
      if(guess != null && currentCard){
        if(guess && values.indexOf(res.data.cards[0].value) > values.indexOf(currentCard?.cards[0].value))
        setScore(score + 1);
        else if(!guess && values.indexOf(res.data.cards[0].value) < values.indexOf(currentCard?.cards[0].value))
            setScore(score + 1);
      }
      setcurrentCard(res.data)
      setLoading(false);
    }).catch(e => setLoading(false))
  }
  
  const bet = (b: boolean) => {
    console.log("clock");
    setLoading(true);
    carousel.current?.snapToNext(true)
    deck && setUpNewCard(deck.deck_id, b)
  }

  useEffect(() => {
    setUpNewDeck()
  }, [])

  useEffect(() => {
    if(currentCard?.remaining === 0){
      setUpNewDeck()
    }
  }, [currentCard])

  if(!deck) return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
     alignItems: 'center'}}>
       <ActivityIndicator color={'red'} />
    </View>
  )

  return (
      <SafeAreaView style={styles.game}>
        <View style={{flex: 3, alignItems: 'center', justifyContent: 'space-between'}}>
          <Text>score: {score}</Text>
          <Text>left: {currentCard?.remaining || deck.remaining}</Text>
          <Carousel
            ref={carousel}
            data={cards}
            renderItem={renderCard}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            sliderWidth={SLIDER_WIDTH}
            sliderHeight={ITEM_HEIGHT}
            scrollEnabled={false}
            useScrollView={false}
            layout={'tinder'}
            lockScrollWhileSnapping
            loop={true}
          />
        </View>
     
        <View 
          pointerEvents={loading ? 'none' : 'auto'} style={{flex: 1,
           flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={() => bet(true)}
        >
            <Text>Higher</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => bet(false)}  
          >
            <Text>Lower</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  game: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  button: {
    flex: 1,
            backgroundColor: 'blue',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            padding: 10
  },
});

export default App;
