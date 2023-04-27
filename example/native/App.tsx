/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {multiply} from '@linkbridge/native';

function App(): JSX.Element {
  const [num, setNum] = useState(0);

  useEffect(() => {
    multiply(3, 3).then(res => setNum(res));
  }, []);

  return (
    <SafeAreaView>
      <Text style={{fontSize: 26}}>{num}</Text>
    </SafeAreaView>
  );
}

export default App;
