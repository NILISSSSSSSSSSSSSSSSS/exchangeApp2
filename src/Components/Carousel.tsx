import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';
import { imgHost } from '../Constants/Config'

interface Props {
  img: [
    {
      imgSrc: string
      link: string
    }
  ]
}

interface State {
  imgHeight: number | string
}

export default class AppCarousel extends Component<Props, State> {
  constructor(props: object) {
    super(props as Props)
    this.state = {
      imgHeight: 200
    }
  }
  componentDidMount() {
  }
  render() {
    return (
      this.props.img?
      (
        this.props.img.length > 1
      ?(
        <Carousel
          autoplay={true}
          infinite
        >
          {this.props.img.map(item => (
            <a
              key={item.link}
              href={item.link}
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={`${imgHost}${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
      )
      :(
        this.props.img.map(item => (
          <a
            key={item.link}
            href={item.link}
            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
          >
            <img
              src={`${imgHost}${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'));
                this.setState({ imgHeight: 'auto' });
              }}
            />
          </a>
        ))
      )
      )
      : null
    );
  }
}
