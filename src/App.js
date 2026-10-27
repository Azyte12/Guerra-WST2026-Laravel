import './App.css';
import Button from './component/Button';
import Card from './component/Card';
import Form from './component/Form';
import Counter from './component/Counter';
import List from './component/List';
import PostCard from './component/PostCard';
function App() {
  return (
    <>
    <h1>Welcome to React</h1>
      <Button/>
      <Card
        name="Guerra"
        description="This is me."
      />

      <Counter/>

      <Card
        name="Columbina"
        description="Hyposolenia."
      />

      <Form/>

      <List/>

      <PostCard/>
    </>
  );
}

export default App;
