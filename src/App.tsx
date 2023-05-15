import React from 'react';

import {observer} from 'mobx-react';

import Header from './components/Header';
import Footer from "./components/Footer";
import Section1 from "./sections/Section1";
import Section2 from "./sections/Section2";
import Section3 from "./sections/Section3";

const App = observer(() => {

  return (
    <>
      <Header/>
      <main className='container-fluid'>
        <Section1/>
        <Section2/>
        <Section3/>
      </main>
      <Footer/>
    </>
  );
});

export default App;
