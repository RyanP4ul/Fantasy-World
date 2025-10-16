import { getSkillsByItemId } from "@/features/skills/skills";
import { parseFlashUrlencoded } from "@/lib/parse";

export async function POST(req: Request) {
  const data: { itemId: string } = await parseFlashUrlencoded(req);

  if (!data || !data.itemId) {
    return Response.json({ sMsg: "Invalid data!", bSuccess: 0 });
  }

  const items = data.itemId
    .split(",")
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id));

  const itemRecord: Record<number, { cat: string; skills: any[] }> = {};

  for (const item of items) {
    const skills = await getSkillsByItemId(item);

    itemRecord[item] = {
        cat: "Skill",
        skills: [],
    }

    for (const skill of skills) {
        itemRecord[item].skills.push({
            tgtMax: skill.MaxHitTarget,
            isOK: true,
            icon: skill.Icon,
            cd: skill.Cooldown,
            nam: skill.Name,
            tgtMin: "1",
            id: skill.id,
            anim: skill.Animation,
            range: skill.Range,
            damage: skill.Damage,
            mp: skill.Mana,
            tgt: skill.Target,
            ref: skill.Reference,
            typ: skill.Type,
            desc: skill.Description
        });
    }
  }

  return Response.json(itemRecord);
}