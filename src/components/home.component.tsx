import { Component } from "react";
import Cats from "./Cats"
import UserService from "../services/user.service";

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
          <p> Home</p>
          <Cats></Cats>
        </header>
      </div>
    );
  }
}
