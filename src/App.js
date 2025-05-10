import './App.css';
import Header from './components/header';
import Side from './components/side';
import Content from './components/content';

function App() {
  return (
    <div className="App">
        <Header />

        <div className='content'>

        <Side />

        <Content />
        </div>
    </div>
  );
}

export default App;
