import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import {useDispatch, useSelector} from "react-redux";
import {createConnection, destroyConnection, sendMessage, setClientName, typeMessage} from "./chat-reducer";
import {AppStateType} from "./index";

const App: React.FC = () => {
    const messages = useSelector((state: AppStateType) => state.chat.messages)
    const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch(createConnection())
        return () => {
            dispatch(destroyConnection())
        }
    }, [])

    const [message, setMessage] = useState("")
    const [name, setName] = useState("")
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    useEffect( () => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    return (
        <div className={styles.App}>
            <input
                className={styles.elem}
                onChange={(e) => setName(e.currentTarget.value)}
            />
            <button
                className={styles.elem}
                onClick={() => {
                    dispatch(setClientName(name))
                }}
            >set nickname</button>
            <div
                className={styles.messages}
                onScroll={(e) => {
                    let element = e.currentTarget
                    let maxScrollPosition = element.scrollHeight - element.clientHeight

                    if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 5) {
                        setIsAutoScrollActive(true)
                    } else {
                        setIsAutoScrollActive(false)
                    }
                    setLastScrollTop(e.currentTarget.scrollTop)
                }}
            >
                {messages.map((m: any) => {
                    return <div key={m.id}>
                        <b>{m.user.name}:</b> {m.message}
                        <hr/>
                    </div>
                })}
                {typingUsers.map((m: any) => {
                    return <div key={m.id}>
                        <b>{m.name}</b> is typing...
                    </div>
                })}
                <div ref={messagesAnchorRef}/>
            </div>
            <textarea
                className={styles.elem}
                value={message}
                onKeyPress={() => {
                    dispatch(typeMessage())
                }}
                onChange={ (e) => setMessage(e.currentTarget.value)}
            >
            </textarea>
            <button
                className={styles.elem}
                onClick={() => {
                    dispatch(sendMessage(message))
                    setMessage("")
                }}>
                Send
            </button>
        </div>
    )
}

export default App
