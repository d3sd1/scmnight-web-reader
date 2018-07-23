export const NotificationOptions = {
    position: ["top", "right"],
    clickToClose: true,
    timeOut: 5000,
    lastOnBottom: true,
    maxStack: 5,
    preventDuplicates: true,
    animate: "fromRight"
}
/*
    position	["top" or "bottom", "right" or "left"]	["bottom", "right"]	Set the position on the screen where the notifications should display. Pass an array with two values example: ["top", "left"].
    timeOut	int	0	Determine how long a notification should wait before closing. If set to 0 a notification won't close it self.
    showProgressBar	boolean	true	Determine if a progress bar should be shown or not.
    pauseOnHover	boolean	true	Determines if the timeOut should be paused when the notification is hovered.
    lastOnBottom	boolean	true	Determines if new notifications should appear at the bottom or top of the list.
    clickToClose	boolean	true	Determines if notifications should close on click.
    maxLength	int	0	Set the maximum allowed length of the content string. If set to 0 or not defined there is no maximum length.
    maxStack	int	8	Set the maximum number of notifications that can be on the screen at once.
    preventDuplicates	boolean	false	If true prevents duplicates of open notifications.
    preventLastDuplicates	boolean or string	false	If set to "all" prevents duplicates of the latest notification shown ( even if it isn't on screen any more ). If set to "visible" only prevents duplicates of the last created notification if the notification is currently visible.
    theClass	string	null	A class that should be attached to the notification. (It doesn't exactly get attached to the selector but to the first div of the template.)
    rtl	boolean	false	Adds the class .rtl-mode to the notification aligning the icon to the left and adding direction: rtl
    animate	"fromRight" or "fromLeft" or "scale" or "rotate" or null	"fromRight"	Choose the type of animation or set the value to null not to display animations.
    icons   Icons	DefaultIcons	Overrides the default icons
        Icons
            Option	Type	Default	Description
            alert	string	Clock	html string for alert icon
            error	string	Exclamation Point	html string for alert icon
            info	string	Info	html string for alert icon
            warn	string	Warning	html string for warning icon
            success	string	Check	html string for alert icon
 */
