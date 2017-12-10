import React, { PropTypes, Component } from 'react'
import SpeechRecognition from 'react-speech-recognition'


 Dictaphone =()=> {
 
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = this.props

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
      

       {transcript}
     
    )
  }




export default SpeechRecognition(Dictaphone)