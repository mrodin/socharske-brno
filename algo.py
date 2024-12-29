import random
from dataclasses import dataclass
from itertools import count

RECALCULATE_EVERY = 10


@dataclass
class CollectibleItem:
    name: str
    base_value: float
    weight: float
    times_collected: int = 0
    total_collected: int = 0

    def __post_init__(self) -> None:
        self.value: float = self.base_value

    def collect(self) -> None:
        self.times_collected += 1
        self.total_collected += 1


ITEMS: dict[str, "CollectibleItem"] = {
    "A": CollectibleItem("A", 100, 30),
    "B": CollectibleItem("B", 120, 20),
    "C": CollectibleItem("C", 200, 10),
}


@dataclass
class Game:
    def __post_init__(self) -> None:
        self.total_base = sum(item.base_value for item in ITEMS.values())

    def recalculate_values(self) -> None:
        total_net = sum(item.times_collected * item.weight for item in ITEMS.values())

        for item in ITEMS.values():
            item.value -= item.times_collected * item.weight - total_net / len(ITEMS)
            item.times_collected = 0

    def collect(self, name: str) -> None:
        item = ITEMS[name]
        item.collect()

    def status(self, collected: str | None = None) -> None:
        if collected:
            print(f"Collected {collected}")
        for item in ITEMS.values():
            print(
                f"{item.name} [{item.total_collected: >2}]: {item.value:.2f}",
            )
        print("Total value:", sum(item.value for item in ITEMS.values()))
        print()


def main():
    game = Game()
    keys = list(ITEMS.keys())
    for i in count(1):
        print(f"Step {i}")
        item = random.choice(keys)
        game.collect(item)
        if i % RECALCULATE_EVERY == 0:
            game.recalculate_values()
        game.status(item)
        input()


if __name__ == "__main__":
    main()
