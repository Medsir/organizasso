function Reponse(props){
    const author = props.author
    const content = props.content;
    const authorId = props.authorId;
    const date = props.date; // a gérer plus tard
    const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    const avatarUrl = props.avatar == "default" ? defaultAvatarUrl : props.avatar
    const idReponse = props.idReponse
    const idMessage = props.idMessage
    const forum = props.forum

    return(
        <div className="message_display">
            <div className="message_header">
            <img className="message_avatar" src={avatarUrl} alt='pfp' />
            <p className="message_author" onClick={() => { if(props.onUserClick) props.onUserClick(authorId) }}>{author}</p>

            </div>
            <p className="message_content">{content}</p>
            
        </div>
    )

}

export default Reponse;