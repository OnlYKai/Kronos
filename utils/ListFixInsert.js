import ListFix from "ListFix"

export default function listFixInsert(event, name, idx, str) {
    const list = event[name]
    ListFix.add(event, name, "")
    for (let i = list.length - 1; i > idx; i--) ListFix.set(event, name, i, list[i-1])
    ListFix.set(event, name, idx, str)
}