import React, {
  ChangeEventHandler,
  FC,
  useState,
  useEffect,
  Reducer,
  useReducer,
} from "react";
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
    objectID: 1,
  },
  {
    author: "Sokolov Kirill",
    title: "Not my React",
    url: "http:",
    commentsCount: 0,
    point: 0,
    objectID: 2,
  },
  {
    author: "Ivanov Kirill",
    title: "Hot React",
    url: "http:",
    commentsCount: 0,
    point: 0,
    objectID: 3,
  },
];

interface IListProps {
  posts: IPost[];
  onRemoveItem: (p: IPost) => void;
}

const List: FC<IListProps> = (props) => {
  return (
    <>
      {props.posts.map((el) => (
        <div key={el.objectID}>
          <h1>{el.author}</h1>
          <p>{el.title}</p>
          <button onClick={() => props.onRemoveItem(el)}>X</button>
        </div>
      ))}
    </>
  );
};

type IHandleSeach = (val: string) => void;

interface ISearchProps {
  term: string;
  onSearch: IHandleSeach;
  id: string;
  children: string;
}

const InputWithLabel: FC<ISearchProps> = (props) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    props.onSearch(evt.target.value);
  };

  return (
    <>
      <label htmlFor={props.id}>{props.children}</label>
      <input
        id={props.id}
        type="text"
        value={props.term}
        onChange={handleChange}
      />
    </>
  );
};

const useSemiPersistentState = (key: string, initialState = "") => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue] as const;
};

const getAsyncPosts = () =>
  new Promise<{ data: { posts: IPost[] } }>((resolve) => [
    setTimeout(() => resolve({ data: { posts: myPosts } }), 2000),
  ]);

type IPostReducerAction =
  | {
      type: "SET";
      payload: IPost[];
    }
  | {
      type: "DELETE";
      payload: IPost;
    };

const postReducer: Reducer<IPost[], IPostReducerAction> = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "DELETE":
      return state.filter((p) => p.objectID !== action.payload.objectID);
  }
};

function App() {
  // const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [posts, dispatchPosts] = useReducer(postReducer, []);

  useEffect(() => {
    setIsLoading(true);
    getAsyncPosts().then((result) => {
      dispatchPosts({ type: "SET", payload: result.data.posts });
      setIsLoading(false);
    });
  }, []);

  const handleRemovePost = (payload: IPost) => {
    dispatchPosts({ type: "DELETE", payload });
  };

  const [searchTerm, setSearchTerm] = useSemiPersistentState("search");

  const handleSearch: IHandleSeach = (term) => {
    setSearchTerm(term);
  };

  const searchPosts = posts.filter((el) =>
    el.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <InputWithLabel id="search" onSearch={handleSearch} term={searchTerm}>
        Search
      </InputWithLabel>
      <p>{searchTerm}</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List posts={searchPosts} onRemoveItem={handleRemovePost} />
      )}
    </div>
  );
}

export default App;
