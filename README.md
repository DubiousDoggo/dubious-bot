# dubious-bot
A discord bot custom made for my servers and friends.

## Features
 - Configurable message logging
 - Automated role assigning
 - Administrator permission management

## Commands
### addadminrole
Adds a role to the list of admin roles.  
This only gives the role access to admin bot commands, not server access.
> Usage `addadminrole <...@role>`


### addassignablerole
Adds a role to the list of assignable roles.  
Users will be able to self-assign and remove the listed roles using the giverole and removerole commands.
> Usage `addassignablerole <...@role>`


### clearadminroles
Clears the list of admin roles.  
*Warning: This command may revoke admin access from yourself.*
> Usage `clearadminroles `


### clearassignableroles
Clears the list of self-assignable roles.
> Usage `clearassignableroles `


### command
Enables or disables commands
> Usage `command [<enable|disable> <...command-name>]`


### echo
Repeats a message back to the user.
> Usage `echo <...message>`


### execute
evaluates a javascript expression
> Usage `execute <expression>`


### genreadme
helper script for updating the readme
> Usage `genreadme `


### giverole
Gives the user some roles.  
The roles mentioned must be in the assignable roles list.
> Usage `giverole <...@role>`


### help
help! help! somebody! please!
> Usage `help [<command>]`


### listadminroles
Displays the list of authorized admin roles.
> Usage `listadminroles `


### listassignableroles
Lists the roles that a user can assign to themselves
> Usage `listassignableroles `


### logger
Enables or disables the logger.
> Usage `logger [<enable|disable>]`


### ping
Play a friendly game of Ping Pong
> Usage `ping `


### reloadcommands
reloads all commands and aliases
> Usage `reloadcommands `


### reloadconfig
reloads the config file for this guild.
> Usage `reloadconfig `


### removeadminrole
Revokes a role's access to admin commands.  
*Warning: this may revoke admin access from yourself!*
> Usage `removeadminrole <...@role>`


### removeassignablerole
Removes a role from being self-assignable.
> Usage `removeassignablerole <...@role>`


### removerole
Removes roles from the user.  
The roles mentioned must be in the assignable roles list.
> Usage `removerole <...@assignable-role>`


### setlog
Sets the channel for logging information.  
 The availble categories are default, banAdd, banRemove, userJoin, userLeave, messageDelete, messageUpdate
> Usage `setlog <category>`


### setprefix
Set the command prefix.
> Usage `setprefix <prefix>`


### status
Gives a list of things about the bot
> Usage `status `