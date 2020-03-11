function doFollows() {
    let buttons = null;

    buttons = Array.from(document.querySelectorAll('.sqdOP.L3NKy.y3zKF:not(._8A5w5)'));

    buttons.reduce((chain, button) => {
        return chain.then(() => {
            button.click();
            return new Promise((resolve) => {
                setTimeout(resolve, 600);
            });
        });
    }, Promise.resolve());

    console.log(buttons.length);
}