import React, { useEffect, useState } from 'react'
import { Carousel } from 'antd'
import * as firebase from 'firebase/app'
import './index.scss'
import HighlightItem from './highlightItem'

function HighlightPost(props) {
  const { isBroken, history } = props
  const [data, setData] = useState([])

  useEffect(() => {
    firebase
      .database()
      .ref(`posts`)
      .once('value', snapshot => {
        const temp = snapshot.val()
          ? Object.keys(snapshot.val()).map(key => ({
              ...snapshot.val()[key],
              countComment: snapshot.val()[key].comments
                ? Object.keys(snapshot.val()[key].comments).length
                : 0,
              countReaction: snapshot.val()[key].reactions
                ? Object.keys(snapshot.val()[key].reactions)
                    .map(keyA => snapshot.val()[key].reactions[keyA].count)
                    .reduce((a, b) => a + b)
                : 0,
              id: key
            }))
          : []
        const data = temp
          .sort(
            (a, b) =>
              b.countComment +
              b.countReaction -
              (a.countComment + a.countReaction)
          )
          ?.slice(0, 6)
        setData(data)
      })
  }, [])
  return (
    <Carousel
      slidesToShow={isBroken ? 2 : 4}
      autoplay
      autoplaySpeed={1500}
      style={{ marginBottom: 10 }}
      swipeToSlide
    >
      {data.map((item, idx) => {
        return (
          <div key={idx}>
            <HighlightItem history={history} key={idx} item={item?.id} />
          </div>
        )
      })}
    </Carousel>
  )
}
export default HighlightPost
