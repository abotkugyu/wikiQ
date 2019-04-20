class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  render() {
    return (
        <div>
          <div>wikiQとは
            <ul>
                <li>wikipediaのページの概要から、記事のタイトルかを答えるクイズアプリです。</li>
            </ul>
          </div>
          <div>使い方
            <ul>
                <li>開始したら概要が流れますので、テキストボックスに答えを入力して送信してください</li>
            </ul>
          </div>
          <div>注意点
            <ul>
                <li>難しすぎる</li>
            </ul>
          </div>
        </div>
    )
  } 
}