function Message(props){
    const author = props.author
    const content = props.content;
    const date = props.date; // a gérer plus tard
    const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    const avatarUrl = props.avatar == "default" ? defaultAvatarUrl : props.avatar
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