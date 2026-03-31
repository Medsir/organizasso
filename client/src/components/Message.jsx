function Message(props){
    const author = props.author
    const content = props.content;

    return(
        <div class="message_display">
            <p>[{author}]: {content}</p>
        </div>
    )

}

export default Message;