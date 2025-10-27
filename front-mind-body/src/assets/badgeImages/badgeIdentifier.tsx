import Day3 from "../badgeImages/3day.png"
import Day7 from "../badgeImages/7day.png"
import Day30 from "../badgeImages/30day.png"
import { UserBadgeDTO } from "../../services/userBadgeService"

export const badgeIdentifier:Record<string,string> = {
    "Consistency Rookie":Day3,
    "Week Warrior":Day7,
    "Unstoppable":Day30,
}

export const getBadgeImage =(badge:UserBadgeDTO):string =>{
    return badgeIdentifier[badge.badge_name] || Day3;
}