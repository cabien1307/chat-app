import "./UserOnline.css";

function UserOnline({ user, isOnline }) {
    return (
        <>
            <div className="avt w-16 h-16 relative mr-2">
                <img
                    className="w-full h-auto rounded-full"
                    src={user.avatar ? user.avatar : "https://icon-library.com/images/groups-icon-png/groups-icon-png-4.jpg"}
                    alt="avt"
                />
                {isOnline ? (
                    <div className="absolute w-4 h-4 rounded-full bg-green-500 right-1 border-2 bottom-0"></div>
                ) : (
                    ""
                )}
            </div>

            <div>
                <h1 className="text-heading text-base">
                    {user.name}
                </h1>
                <div className="flex">
                    <p className="text-desc text-sm mr-5 w-40 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {user.email ? user.email : "Our Groups"}
                    </p>
                </div>
            </div>
        </>


    );
}

export default UserOnline;
