export default (
    {isOpen}:
    { isOpen: boolean }) =>
    (
    <>
        <div className={`icon nav-icon-5 ${isOpen && 'open'}`}>
            <span></span>
            <span></span>
            <span></span>
        </div>

        <style jsx>{`
            .nav-icon-5 {
                width: 32px;
                height: 32px;
                margin: 10px 10px;
                position: relative;
                cursor: pointer;
                display: inline-block;
            }

            .nav-icon-5 span {
                background-color: var(--foreground);
                position: absolute;
                border-radius: 2px;
                transition: .3s cubic-bezier(.8, .5, .2, 1.4);
                width: 100%;
                height: 4px;
                transition-duration: 500ms
            }

            .nav-icon-5 span:nth-child(1) {
                top: 0;
                left: 0;
            }

            .nav-icon-5 span:nth-child(2) {
                top: 13px;
                left: 0;
                opacity: 1;
            }

            .nav-icon-5 span:nth-child(3) {
                bottom: 0;
                left: 0;
            }

            .nav-icon-5:not(.open):hover span:nth-child(1) {
                transform: rotate(-3deg) scaleY(1.1);
            }

            .nav-icon-5:not(.open):hover span:nth-child(2) {
                transform: rotate(3deg) scaleY(1.1);
            }

            .nav-icon-5:not(.open):hover span:nth-child(3) {
                transform: rotate(-4deg) scaleY(1.1);
            }

            .nav-icon-5.open span:nth-child(1) {
                transform: rotate(45deg);
                top: 13px;
            }

            .nav-icon-5.open span:nth-child(2) {
                opacity: 0;
            }

            .nav-icon-5.open span:nth-child(3) {
                transform: rotate(-45deg);
                top: 13px;
            }

        `}</style>
    </>
)