import React, { ChangeEventHandler, FC } from "react";
import "./App.css";

interface IPost {
  title: string;
  url: string;
  author: string;
  commentsCount: number;
  point: number;
  objectID: number;
}

const myPosts: IPost[] = [
  {
    author: "Sokolov Mikhail",
    title: "My React",
    url: "http:",
    commentsCount: 0,
    point: 0,
    objectID: 123,
  },
  {
    author: "Sokolov Kirill",
    title: "Not my React",
    url: "http:",
    commentsCount: 0,
    point: 0,
    objectID: 123,
  },
];

const List: FC<{ posts: IPost[] }> = (props: { posts: IPost[] }) => {
  return (
    <>
      {props.posts.map((el) => (
        <div key={el.objectID}>
          <h1>{el.author}</h1>
          <p>{el.title}</p>
        </div>
      ))}
    </>
  );
};

type IHandleSeach = (val: string) => void;

const Search: FC<{ onSearch: IHandleSeach }> = (props) => {
  // const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    // setSearchTerm(evt.target.value);
    props.onSearch(evt.target.value);
  };

  return (
    <>
      <input type="text" onChange={handleChange} />
      {/* <p>Строка: {searchTerm}</p> */}
    </>
  );
};

function App() {

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearch: IHandleSeach = (term) => setSearchTerm(term);
  
  return (
    <div className="App">
      <Search onSearch={handleSearch} />
      <p>{searchTerm}</p>
      <List posts={myPosts} />
    </div>
  );
}

export default App;
