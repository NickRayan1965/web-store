import { User } from '../../entities';
import { ValidRoles } from '../../interfaces/valid_roles.interface';
export interface Resource {
    [k: string]: any;
}
export interface ValidateResourseOwnerOptions {
    requestingUser: User;
    resource: Resource
    resourceOwnerKey?: string,
    rolesWithAccessToOtherResources?: ValidRoles[],
}
const ValidateResourseOwner = ({
    requestingUser,
    resource,
    resourceOwnerKey = 'id',
    rolesWithAccessToOtherResources = [ValidRoles.admin]
}: ValidateResourseOwnerOptions)=>{
    const isOwnResource = requestingUser.id.toString() === resource[resourceOwnerKey].toString();
    const hasAccessToOtherResources = requestingUser.roles.some(
        role => rolesWithAccessToOtherResources.includes(role)
    );
    return isOwnResource || hasAccessToOtherResources;
};
export default ValidateResourseOwner;