
export const rarities = [
    { val: 0, sName: "Unknown", color: "#CCCCCC" }, // gray
    { val: 10, sName: "Unknown", color: "#CCCCCC" }, // gray
    { val: 11, sName: "Common", color: "#FFFFFF" }, // white
    { val: 12, sName: "Weird", color: "#00BCD4" }, // cyan
    { val: 13, sName: "Awesome", color: "#4CAF50" }, // green
    { val: 14, sName: "1% Drop", color: "#FF9800" }, // orange
    { val: 15, sName: "5% Drop", color: "#FFC107" }, // amber
    { val: 16, sName: "Boss Drop", color: "#E91E63" }, // pink
    { val: 17, sName: "Secret", color: "#673AB7" }, // deep purple
    { val: 18, sName: "Junk", color: "#795548" }, // brown
    { val: 19, sName: "Impossible", color: "#000000" }, // black
    { val: 20, sName: "Artifact", color: "#FFD700" }, // gold
    { val: 21, sName: "Limited Time Drop", color: "#FF5722" }, // deep orange
    { val: 68, sName: "New Collection Chest", color: "#8BC34A" }, // light green
    { val: 23, sName: "Crazy", color: "#FF00FF" }, // magenta
    { val: 24, sName: "Expensive", color: "#DAA520" }, // goldenrod
    { val: 30, sName: "Rare", color: "#2196F3" }, // blue
    { val: 35, sName: "Epic", color: "#9C27B0" }, // purple
    { val: 40, sName: "Import Item", color: "#00CED1" }, // dark turquoise
    { val: 50, sName: "Seasonal Item", color: "#3F51B5" }, // indigo
    { val: 55, sName: "Seasonal Rare", color: "#7B1FA2" }, // dark purple
    { val: 60, sName: "Event Item", color: "#009688" }, // teal
    { val: 65, sName: "Event Rare", color: "#00695C" }, // dark teal
    { val: 70, sName: "Limited Rare", color: "#B71C1C" }, // dark red
    { val: 75, sName: "Collector's Rare", color: "#FFD700" }, // gold
    { val: 80, sName: "Promotional Item", color: "#FF69B4" }, // hot pink
    { val: 90, sName: "Ultra Rare", color: "#FF4500" }, // orange red
    { val: 95, sName: "Super Mega Ultra Rare", color: "#FF1493" }, // deep pink
    { val: 100, sName: "Legendary Item", color: "#FFD700" }, // gold
  ]

export function getRarity(rarity:number) {
    return rarities.find(r => r.val === rarity) || rarities[0];
}