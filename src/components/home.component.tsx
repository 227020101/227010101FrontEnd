import { Component } from "react";
import Cats from "./Cats"


type Props = {};

type State = {
  content: string;
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h1> Cats List </h1>
          <Cats></Cats>
        </header>
      </div>
    );
  }
}
