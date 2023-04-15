import { ActionIcon, Group, NumberInput, Space, Text, Title } from "@mantine/core";
import styles from "./App.module.css";
import { IconArrowBarToLeft, IconArrowLeft, IconDice2, IconArrowRight, IconArrowBarToRight, IconCircleCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import ReactMarkdown from "react-markdown";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function App() {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [jumpTo, setJumpTo] = useState();
    const [changelog, setChangelog] = useState("Failed to load the changelog");

    useEffect(() => {
        fetch("/list.php")
            .then((res) => res.json())
            .then(
                (result) => {
                    setImages(result);
                },
                (error) => {
                    notifications.show({
                        title: "Nie udało się załadować listy zdjęć",
                        message: (
                            <Text>
                                {error.toString()}
                                <br />
                                Jeśli błąd się powtarza, sprawdź błąd w konsoli
                            </Text>
                        ),
                        color: "red",
                    });
                }
            );

        fetch("/Changelog.md")
            .then((res) => res.text())
            .then(
                (result) => {
                    setChangelog(result);
                },
                () => {}
            );
    }, []);

    function clampIndex(num) {
        return Math.max(0, Math.min(num, images.length - 1));
    }

    function changeImage(type) {
        switch (type) {
            case "prev":
                setIndex((current) => clampIndex(current - 1));
                break;
            case "next":
                setIndex((current) => clampIndex(current + 1));
                break;
            case "random":
                setIndex(getRandomInt(0, images.length - 1));
                break;
            case "first":
                setIndex(0);
                break;
            case "last":
                setIndex(images.length - 1);
                break;
            default:
                break;
        }
    }

    function handleNumInput(e) {
        if (e.key === "Enter") jump();
    }

    function jump() {
        setIndex(clampIndex(jumpTo - 1));
    }

    return (
        <div className={styles.container}>
            <Title order={2}>Dobrego Popołudnia</Title>

            <Group spacing="xs">
                <ActionIcon title="Pierwszy obraz" onClick={() => changeImage("first")} variant="light" color="green" size="xl">
                    <IconArrowBarToLeft size="1.2rem" />
                </ActionIcon>
                <ActionIcon title="Poprzedni obraz" onClick={() => changeImage("prev")} variant="light" color="green" size="xl">
                    <IconArrowLeft size="1.2rem" />
                </ActionIcon>
                <ActionIcon title="Losowy obraz" onClick={() => changeImage("random")} variant="light" color="green" size="xl">
                    <IconDice2 size="1.2rem" />
                </ActionIcon>
                <ActionIcon title="Następny obraz" onClick={() => changeImage("next")} variant="light" color="green" size="xl">
                    <IconArrowRight size="1.2rem" />
                </ActionIcon>
                <ActionIcon title="Ostatni obraz" onClick={() => changeImage("last")} variant="light" color="green" size="xl">
                    <IconArrowBarToRight size="1.2rem" />
                </ActionIcon>
                <Space w="lg" />
                <NumberInput size="md" placeholder="Przeskocz" variant="filled" onKeyDown={handleNumInput} value={jumpTo} onChange={setJumpTo} />
                <ActionIcon title="Przeskocz" onClick={jump} variant="light" color="gray" size="xl">
                    <IconCircleCheck size="1.2rem" />
                </ActionIcon>
            </Group>

            <br />
            <Text>
                {index + 1} / {images.length}
            </Text>
            <img alt="obraz" className={styles.image} src={`/img/${images[index]}`} />
            <br />
            <br />
            <Text c="blue" underline component="a" href="/img.zip">
                Pobierz wszystko jako .zip
            </Text>
            <br />
            <Text c="blue" underline component="a" href="/old.html">
                Idź do starej strony
            </Text>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <ReactMarkdown children={changelog} />
        </div>
    );
}
