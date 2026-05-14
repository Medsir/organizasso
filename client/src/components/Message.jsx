function Message(props){
    const author = props.author
    const content = props.content;
    const date = props.date; // a gérer plus tard
    const avatarUrl = 'https://i.pinimg.com/236x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg'
    return(
        <div class="message_display">
            <div className="message_header">
            <img className="message_avatar" src={avatarUrl} alt='pfp' />
            <p className="message_author">{author}</p>

            </div>
            <p className="message_content">{content}</p>
        </div>
    )

}

export default Message;