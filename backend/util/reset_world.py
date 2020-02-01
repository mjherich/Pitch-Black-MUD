# Reset World
Room.objects.all().delete()
Item.objects.all().delete()

# Create items
type_items = ["hammer", "bat", "sword", "axe"]
item_adj = ["plastic", "metal", "golden"]
items = [None] * 12

for i in range(12):
    s = f"{random.choice(item_adj)} {random.choice(type_items)}"
    item = Item.objects.create(name=s, level=1, description="")
    item.save()
    items.append(item)
    
random.shuffle(items)
