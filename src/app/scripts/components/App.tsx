import React, { useCallback, useMemo, useState } from "react";
import "@geotab/zenith/dist/index.css";
import "../../styles/app.css";
import {
    Button,
    FooterButtons,
    Header,
    IconQuestion,
    Menu,
    Modal,
    Tabs,
} from "@geotab/zenith";
import { Tab1Content } from "./Tab1Content";
import { Tab2Content } from "./Tab2Content";
import { Tab3Content } from "./Tab3Content";

const App: React.FC = () => {
    const [isHelpVisible, setHelpVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("tab1");
    const tabs = useMemo(() => [{
        id: "tab1",
        name: "Dashboard"
    }, {
        id: "tab2",
        name: "Leaderboard"
    }, {
        id: "tab3",
        name: "Rules"
    }], []);

    const content = useMemo(() => ({
        "tab1": <Tab1Content />,
        "tab2": <Tab2Content />,
        "tab3": <Tab3Content />
    }), []);

    const contactSupport = useCallback(() => {
        console.log("Contact support");
        setHelpVisible(false);
    }, []);

    return <div className="zda-app">
        <Header className="zda-app__header">
            <Header.Title pageName="Geotab Driver Scratchie" />
            <Header.Button id="about" type="tertiary" icon={IconQuestion} onClick={() => setHelpVisible(true)}></Header.Button>
            <Header.Menu id="submenu" type="tertiary" name="More">
                <Menu.Item id="settings" name="Settings" onClick={() => { console.log("Settings"); }} />
                <Menu.Item id="action1" name="Action 1" onClick={() => { console.log("Action 1"); }} />
                <Menu.Item id="action2" name="Action 2" onClick={() => { console.log("Action 2"); }} />
                <Menu.Item id="action3" name="Action 3" onClick={() => { console.log("Action 3"); }} />
            </Header.Menu>
            <Tabs key="headerTabs" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
        </Header>

        <div className="zda-app__content">
           { content[activeTab as ("tab1" | "tab2" | "tab3")] || null }
        </div>
        <FooterButtons isSticky={true}>
            <Button type="primary">Main action</Button>
        </FooterButtons>

        { isHelpVisible
            ? <Modal type="info" isOpen={true} onClose={() => setHelpVisible(false)} title="About this add-in">
                    This add-in allows you to track driver performance and reward good driving behavior with Scratchie tickets. Use the dashboard to see overall performance, the leaderboard to view individual drivers, and the rules section to configure automatic rewards.
                    <Modal.TertiaryButton onClick={ contactSupport }>Contact support</Modal.TertiaryButton>
                </Modal>
            : null }
    </div>
};

export default App;
