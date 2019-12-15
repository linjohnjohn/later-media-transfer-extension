let buttons = null;

buttons = Array.from(document.querySelectorAll('._0mzm-.sqdOP.L3NKy:not(._8A5w5)'));

buttons.reduce((chain, button) => {
    return chain.then(() => {
        button.click();
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    });
}, Promise.resolve());

console.log(buttons.length);