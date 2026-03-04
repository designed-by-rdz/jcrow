<template>
    <div class="main-layout">
        <div class="menu-bar">
            <img src="../assets/vue.svg" class="logo">
            <div class="options" id="file" v-on:click="toggleMenu('subfile')">File</div>
            <div class="exit submenus hidden" id="subfile" v-on:click="toggleMenu('subfile')">
                <div class="submenu">
                    <div class="suboption" @click="resetRow">New</div>
                    <div class="suboption" @click="handleOpenFile">Open</div>
                    <div class="suboption" @click="saveJson">Save</div>
                    <div class="suboption" @click="saveAsJson">Save As</div>
                    <div class="suboption" v-on:click="exitApp()">Exit</div>
                </div>
            </div>
            <div class="options hidden" v-on:click="toggleMenu('subedit')">Edit</div>
            <div class="exit submenus hidden" id="subedit" v-on:click="toggleMenu('subedit')">
                <div class="submenu">
                    <div class="suboption">Cut</div>
                    <div class="suboption" @click="copyText">Copy</div>
                    <div class="suboption" @click="pasteText">Paste</div>
                </div>
            </div>
            <div class="options" v-on:click="displayText()">About</div>
            <!--  v-on:click="displayText('Credits. Icon')" -->
            <div class="exit submenus hidden" id="subhelp" v-on:click="toggleMenu('subhelp')">
                <div class="submenu">
                    <div class="suboption">Tutorial</div>
                    <div class="suboption" v-on:click="displayText">About</div>
                </div>
            </div>
            <div class="title-bar">{{ filename }}<span v-if="isUnsaved">*</span></div>
        </div>
        <div class="main-bar">
            <div class="side-bar" style="width: 200px;">
                <div style="margin-bottom: 10px;">History</div>
                <div class="history-list" v-for="list in history">
                    <div class="files-list" @click="openFileFromHistory(list)">{{ list }}</div>
                </div>
            </div>
            <div class="main-content" id="maincontent">
                 <div class="top-bar">
                    <div class="material-symbols-outlined box-button btn-edit" :style="{color: isUnsaved ? 'coral' : 'var(--text-color-light)'}" @click="saveJson" title="Save File">save</div>
                    <div class="material-symbols-outlined box-button btn-edit" @click="editColumnValue" title="Edit Cell">edit_square</div>
                    <div class="material-symbols-outlined box-button btn-add" @click="addColumn" title="Add Column">add_column_right</div>
                    <div class="material-symbols-outlined box-button btn-add" @click="addRow" title="Add Row">add_row_below</div>
                    <div class="material-symbols-outlined box-button btn-del" @click="deleteSelectedRow" title="Remove Row">delete</div>
                    <input type="text" v-model="txtSearch" class="input-text" placeholder="Search for a value...">
                    <div class="row-details"><div>Number of Rows: <span id="num-rows">{{ filteredRows.length }}</span></div></div>
                    <div class="material-symbols-outlined box-button" @click="viewJSON" title="View JSON">code_blocks</div>
                 </div>
                 <div class="table-container" id="table-container">
                    <table id="data-table">
                        <thead @click="selectedRow = null">
                            <tr class="table-header">
                                <th class="row-index">index</th>
                                <th v-for="header in tableHeaders" :key="header" v-on:dblclick="editHeader(header)">
                                {{ header }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex" @click="selectedRow = row" :style="{ background: selectedRow === row ? 'var(--gray-color-quarterary)' : '' }">
                                <td class="row-index" @click="selectedCell = null">{{ (rowIndex - 1) + 1 }}</td>
                                <td v-for="header in tableHeaders" :key="header" @click="selectedCell = row[header] + rowIndex" :style="{border: selectedCell === row[header] + rowIndex ? '1px solid var(--text-color-light)' : '' }" v-on:click="clickCell(row[header],rowIndex, header)" v-on:dblclick="editValue(row[header],rowIndex, header)">
                                    {{ row[header] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
            </div>
            <div id="right-side" class="word-viewer" style="display: none;">
                <div class="material-symbols-outlined box-button btn-del" @click="viewJSON" title="Close">close</div>
                <pre class="json-block">{{ rows }}</pre><div class="word-notice">Note: key-value pairs with empty values will be removed upon saving to file.</div>
            </div>
        </div>
    </div>
    <div class="modal" id="modal">
        <div class="modal-form" id="print-text">
            <div class="modal-header"><div class="material-symbols-outlined box-button btn-del" @click="closeModal" title="Close">close_small</div></div>
            <div class="modal-body centered">
                <div class="modal-title">About JCRow</div>
                <div class="modal-img"><img src="../assets/vue.svg" style="height: 80px;"></div>
                <div>JCRow</div>
                <div class="modal-sub">v0.5</div>
                <div style="font-size: small;">A JSON Structure Tabulator. This program visualizes your JSON file into a relational database and let's you edit it in a tabular structure.</div>
                <div style="margin-top: 5px; font-size: small;">
                    <div>Copyright &copy; 2026</div>
                    <div><a class="modal-link" href="https://designedbyrdz.com" target="_blank">designed.by.rdz</a></div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="modal-button" id="btnprintok" @click="closeModal">Close</div>
            </div>
        </div>
        <div class="modal-form" id="prompt-text">
            <div class="modal-header"><div class="material-symbols-outlined box-button btn-del" @click="closeModal" title="Close">close_small</div></div>
            <div class="modal-body">
                <div>{{ messageBody }}</div>
                <div>
                    <div v-if="currentType == 'number'">
                        <input type="text" class="input-text" id="txtPrompt" inputmode="numeric" v-model="promptAnswer" oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/(?!^)-/g, '');">
                    </div>
                    <div v-else-if="currentType == 'boolean'">
                        <select id="txtPrompt" style="margin-top: 5px;" v-model="promptAnswer">
                                <option value=true>True</option>
                                <option value=false>False</option>
                        </select>
                    </div>
                    <div v-else>
                        <input type="text" class="input-text" id="txtPrompt" v-model="promptAnswer">
                    </div>
                </div>
                <div v-if="promptTitle == 'edit-value'">
                    <select id="txtType" v-model="currentType">
                            <option value=string>String</option>
                            <option value=number>Number</option>
                            <option value=boolean>Boolean</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <div class="modal-button btn-del" @click="closeModal">Cancel</div>
                <div class="modal-button" id="btnpromptok" @click="submitPrompt">Okay</div>
            </div>
        </div>
        <div class="modal-form" id="option-text">
            <div class="modal-header"><div class="material-symbols-outlined box-button btn-del" @click="closeModal" title="Close">close_small</div></div>
            <div class="modal-body">
                <div>Are you sure?</div>
            </div>
            <div class="modal-footer">
                <div class="modal-button btn-del" @click="closeModal" >No</div>
                <div class="modal-button" id="btnoptionok" @click="submitOption">Yes</div>
            </div>
        </div>
    </div>
    <div id="notif" class="notification-body" @click="closeNotification">
        Notice: {{ messageBody }}
    </div>
</template>


<style lang="css" scoped>
    .main-layout {
        height: 100%;
    }
    .menu-bar {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid var(--gray-color-primary);
        padding: 5px 10px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    .menu-bar img {
        height: 17px;
        margin-right: 7px;
    }
    .menu-bar .options {
        text-align: center;
        padding: 2px 8px;
        background-color: var(--gray-color-main);
    }
    .menu-bar .options:hover, .submenu .suboption:hover, .box-button:hover, .modal-button:hover, .history-list div:hover{
        filter: brightness(1.25);
    }
    .menu-bar .title-bar {
        padding: 2px 8px;
        width: -webkit-fill-available;
        text-align: center;
        text-indent: -10vw;
        color: var(--text-color-light);
    }
    .submenu {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 29px;
        gap: 2px;
        border: 1px solid var(--gray-color-primary);
        z-index: 1;
        background-color: var(--gray-color-main);
    }
    .submenu .suboption {
        padding: 2px 10px;
        background-color: var(--gray-color-main);
        border-bottom: 1px solid var(--gray-color-primary);
    }
    #subfile {
        left: 35px;
    }
    #subedit {
        left: 72px;
    }
    #subhelp {
        /* left: 112px; */
        left: 72px;
    }
    .hidden {
        display: none;
    }
    .exit {
        position: absolute;
        top: 0;
        height: -webkit-fill-available;
        width: -webkit-fill-available;
    }
    .main-bar {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
    }
    .side-bar {
        background-color:var(--gray-color-quarterary);
        border-right: 1px solid var(--gray-color-primary);
        padding: 10px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    .main-content {
        max-width: calc(100vw - 200px);
        background-color: var(--gray-color-tertiary);
    }
    .btn-del:hover {
        color: coral !important;
    }
    .btn-edit:hover {
        color: cornflowerblue !important;
    }
    .btn-add:hover {
        color: seagreen !important;
    }
    .top-bar {
        display: flex;
        flex-direction: row;
        /* width: calc(100vw - 250px); */
        align-items: center;
        padding: 10px 15px;
        border-bottom: 1px solid var(--gray-color-primary);
        gap: 2px;
        padding-right: 35px;
        user-select: none;
        z-index: 0;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    .top-bar input {
        max-width: 350px;
    }
    .row-details {
        text-align: right;
        width: 100vw;
    }
    .input-text, select {
        padding: 5px 7px;
        background-color: var(--gray-color-tertiary);
        border: 1px solid var(--gray-color-primary);
        color: var(--text-color-primary);
        margin-left: 5px;
    }
    input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .box-button {
        background-color: var(--gray-color-tertiary);
        color: var(--text-color-light);
        font-size: large;
        padding: 5px;
    }
    .table-container {
        overflow: auto;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    .table-header {
        position: sticky;
        top: -0.65px;
        z-index: 3;
    }
    .table-header th {
        padding: 10px 10px;
        background-color: var(--gray-color-main);
        text-align: left;
    }
    table td {
        padding: 5px 10px;
    }
    table tr {
        background-color: var(--gray-color-tertiary);
        border-top: 1px solid var(--gray-color-main);
    }
    table tbody tr:hover {
        filter: brightness(1.15);
    }
    table th, table td {
        white-space: nowrap;
    }
    .row-index {
        background-color: var(--gray-color-main);
        text-align: right;
        position:sticky;
        z-index: 2;
        left: 0;
        width: 30px;
    }
    .history-list {
        text-indent: 10px;
        display: flex;
        flex-direction: column;
    }
    .history-list div {
        background-color: var(--gray-color-quarterary);
        padding: 5px 0px;
    }
    .word-viewer {
        width: 300px;
        padding: 10px;
        border-left: 1px solid var(--gray-color-primary);
        flex-direction: column;
        position: sticky;
        z-index: 5;
    }
    .json-block {
        max-height: 80vh;
        overflow: auto;
    }
    .word-viewer pre {
        text-wrap: pretty;
    }
    .word-viewer .box-button, .modal .box-button {
        background-color: var(--gray-color-main);
        align-self: end;
        width: -webkit-fit-content;
    }
    .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: -webkit-fill-available;
        height: -webkit-fill-available;
        background-color: rgba(0, 0, 0, 0.404);
        display: none;
        align-items: center;
        place-content: center;
    }
    .modal-form {
        width: 300px;
        height: 360px;
        background-color: var(--gray-color-main);
        border: 1px solid var(--gray-color-primary);
        display: none;
    }
    #prompt-text {
        height: 180px;
    }
    #option-text {
        height: 130px;
    }
    .modal-header {
        border-bottom: 1px solid var(--gray-color-primary);
        text-align: end;
        padding: 5px;
    }
    .modal-body {
        padding: 10px;
        height: 260px;
        font-size: medium;
    }
    #prompt-text .modal-body {
        height: 80px;
    }
    #option-text .modal-body {
        height: 30px;
    }
    .modal-body .input-text {
        margin-top: 5px;
        margin-left: 0px;
        width: -webkit-fill-available;
    }
    .modal-footer {
        border-top: 1px solid var(--gray-color-primary);
        text-align: end;
        display: flex;
    }
    .modal-button {
        background-color: var(--gray-color-main);
        width: -webkit-fill-available;
        text-align: center;
        padding: 12.5px;
    }
    .modal-button:nth-child(1) {
        border-right: 1px solid var(--gray-color-primary);
    }
    .files-list {
        white-space: nowrap;
        direction: rtl;
        text-align: left;
        text-overflow: ellipsis;
        overflow: clip;
        text-indent: 20px;
        padding-left: 10px !important;
    }
    #num-rows {
        padding-right: 5px;
    }
    .notification-body {
        position: absolute;
        bottom: 0;
        left: 220px;
        padding: 10px 10px;
        margin: 10px;
        width: -webkit-fill-available;
        color: var(--gray-color-main);
        text-overflow: ellipsis;
        overflow: clip;
        display: none;
        filter: drop-shadow(0px 0px 3px #00000011);
    }
    select {
        width: -webkit-fill-available;
        border-radius: 0;
        appearance: none;
        margin-left: 0;
    }
    .centered {
        text-align: center;
    }
    .modal-img {
        width: -webkit-fill-available; 
        text-align: center;
        padding: 10px;
    }
    .modal-link {
        cursor: pointer;
        text-decoration: none;
        color: unset;
        font-weight: 600;
    }
    .modal-link:hover {
        color: #f79802;
    }
    .modal-sub {
        color: var(--text-color-light);
        font-size: smaller;
        margin-bottom: 5px;
        font-style: italic;
    }
    .word-notice {
        font-style: italic;
        color: var(--text-color-light);
        font-size: smaller;
    }
</style>

<script lang="ts" setup>
import { exit } from '@tauri-apps/plugin-process';
import { ref, computed, onMounted } from 'vue';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { basename, downloadDir, join } from '@tauri-apps/api/path'; 
const txtSearch = ref('');
const rows = ref<any[]>([{}]);
const history = ref<string[]>([]);
const fileContent = ref('');
const selectedRow = ref(null);
const selectedCell = ref(null);
const messageBody = ref('');
const filename = ref('new-file.json*');
const filepath = ref('');
const promptAnswer = ref('');
const promptTitle = ref('');
const editIndex = ref(0);
const editKey = ref('');
const isOkay = ref(false);
const isUnsaved = ref(false);
const currentType = ref('');
const valuesForEdit = ref<any[]>([]);
onMounted(() => {
    const stored = localStorage.getItem('recent_files');
    if (stored) {
        history.value = JSON.parse(stored);
    }
    window.addEventListener("keydown", async (e) => {
        if (e.ctrlKey && e.key === "n") {
            resetRow();
        } else if (e.ctrlKey && e.key === "o") {
            await handleOpenFile();
        } else if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
            await saveAsJson();
        } else if (e.ctrlKey && e.key === "s") {
            await saveJson();
        } else if (e.ctrlKey && e.key === "q") {
            exitApp();
        }
    });
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    }, false);
});
const resizeContainer = () => {
    const target = document.querySelector('.main-content');
    const dependent = document.getElementById('table-container');
    if (target) {
        const observer = new ResizeObserver(entries => {
            const width = entries[0].contentRect.width;
            const height = entries[0].contentRect.height - 28;
            dependent!.style.width = `${width}px`;
            dependent!.style.height = `${height}px`;
        });
        observer.observe(target!);
    }
}
const tableHeaders = computed(() => {
    if (rows.value.length === 0) return [];
    return Object.keys(rows.value[0]);
});
const toggleMenu = (subMenuId:string) => {
    const subMenu = document.getElementById(subMenuId);
    document.querySelectorAll(".submenus").forEach(el => {
        if (!el.classList.contains('hidden') && el.id != subMenuId) {
            el.classList.add("hidden");
        }
    });
    if (subMenu!.classList.contains('hidden')) {
        subMenu!.classList.remove('hidden');
    } else {
        subMenu!.classList.add('hidden');
    }
};
const exitApp = () => {
    promptTitle.value = "quit";
    optionText();
};
const displayText = () => {
    document.getElementById('print-text')!.style.display = "block";
    document.getElementById('modal')!.style.display = "flex";
    document.getElementById('btnprintok')?.focus();
};
const promptText = (msg: string) => {
    document.getElementById('prompt-text')!.style.display = "block";
    document.getElementById('modal')!.style.display = "flex";
    messageBody.value = msg;
    promptAnswer.value = "";
    currentType.value = "";
    editKey.value = "";
    editIndex.value = 0;
    document.getElementById('txtPrompt')?.focus();
};
const optionText = () => {
    document.getElementById('option-text')!.style.display = "block";
    document.getElementById('modal')!.style.display = "flex";
    isOkay.value = false;
    document.getElementById('btnoptionok')?.focus();
};
const showNotification = (msg: string, colore = "coral") => {
    messageBody.value = msg;
    document.getElementById('notif')!.style.display = "block";
    document.getElementById('notif')!.style.backgroundColor = colore;
    setTimeout(() => {
        closeNotification();
    }, 3000);
};
const closeNotification = () => {
    document.getElementById('notif')!.style.display = "none";
};
const handleOpenFile = async () => {
    try {
        const startDir = await downloadDir(); 
        const selected = await open({
            defaultPath: startDir,
            multiple: false,
            filters: [{
                name: 'Text Files',
                extensions: ['json', 'txt']
            }]
        });
        if (selected) {
            await openFile(selected);
            if (!history.value.includes(selected)) {
                    history.value.unshift(selected);
                    if (history.value.length > 15) {
                        history.value.pop();
                    }
                    localStorage.setItem('recent_files', JSON.stringify(history.value));
            } else {
                const index = history.value.indexOf(selected);
                if (index !== -1) {
                    history.value.splice(index, 1);
                    history.value.unshift(selected);
                    localStorage.setItem('recent_files', JSON.stringify(history.value));
                }   
            }
        } else {
            // showNotification("Failed to read from file.");
        }
    } catch (err) {
        showNotification("Failed to open or read file: " + err);
        resetRow();
    }
};
const openFileFromHistory = async (selected : string) => {
    if (selected) {
        const index = history.value.indexOf(selected);
        try {
            await openFile(selected);
        } catch (err) {
            showNotification("Failed to load file: " + err);
            resetRow();
        }
        if (index !== -1) {
            history.value.splice(index, 1);
            history.value.unshift(selected);
            localStorage.setItem('recent_files', JSON.stringify(history.value));
        }
    } else {
        showNotification("Failed to read from file.");
    }
};
const openFile = async (selected:string) => {
    const content = await readTextFile(selected);
    fileContent.value = content;
    filepath.value = selected;
    rows.value = [];
    rows.value = JSON.parse(fileContent.value);
    if (rows.value.length > 500) {
        resetRow();
        showNotification("Cannot parse rows of more than 500 at the moment.");
        return;
    }
    filename.value = selected.substring(selected.lastIndexOf("/") + 1);
    const headers = [...new Set(rows.value.flatMap(Object.keys))];
    const normalizedData = rows.value.map(item => {
        return headers.reduce((acc : any, key) => {
            acc[key] = item.hasOwnProperty(key) ? item[key] : ""; 
            return acc;
        }, {});
    });
    isUnsaved.value = false;
    rows.value = normalizedData;
    resizeContainer();
};
const copyText = async () => {
    const selection = window.getSelection();
    const selectedText = selection!.toString();
    await navigator.clipboard.writeText(selectedText!);
};
const pasteText = async () => {
    const text = await navigator.clipboard.readText();
    return text;
};
const filteredRows = computed(() => {
    if (!txtSearch.value) {
        return rows.value;
    }
    const lowerSearch = txtSearch.value.toLowerCase();
    return rows.value.filter(row => {
        return Object.values(row).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
        );
    });
});
const resetRow = () => {
    rows.value = [{}];
    filename.value = 'new-file.json';
    filepath.value = "";
    isUnsaved.value = true;
};
const addRow = () => {
    if (tableHeaders.value.length === 0) {
        showNotification("Create a column first to add new row.");
        return;
    }
    const newRow = <any>{};
    tableHeaders.value.forEach(key => {
        newRow[key] = ""; 
    });
    rows.value.push(newRow);
    isUnsaved.value = true;
};
const addColumn = () => {
    if (rows.value.length === 0) {
        showNotification("Create new file first.");
        return;
    }
    promptTitle.value = "add-column";
    promptText("Enter the name for the new column:")
};
const addNewColumn = () => {
    rows.value.forEach(row => {
        row[promptAnswer.value] = "";
    });
    isUnsaved.value = true;
};
const deleteSelectedRow = () => {
    if (!selectedRow.value) {
        showNotification("Please select a row first.");
        return;
    }
    promptTitle.value = "delete-row";
    optionText();
};
const deleteRow = () => {
    const index = rows.value.indexOf(selectedRow.value);
    if (index > -1) {
        rows.value.splice(index, 1);
        selectedRow.value = null;  
        isUnsaved.value = true;
    }
};
const viewJSON = () => {
    const rightside = document.getElementById('right-side')?.style;
    const mainbody = document.getElementById('maincontent')?.style;
    if (rightside?.display == "none") {
        rightside!.display = "flex";
        mainbody!.maxWidth = 'calc(100vw - 500px)';
    } else {
        rightside!.display = "none";
        mainbody!.maxWidth = 'calc(100vw - 200px)';
    }
};
const closeModal = () => {
    document.getElementById('print-text')!.style.display = "none";
    document.getElementById('prompt-text')!.style.display = "none";
    document.getElementById('option-text')!.style.display = "none";
    document.getElementById('modal')!.style.display = "none";
    promptAnswer.value = "";
};
const submitPrompt = async () => {
    if (promptTitle.value == "add-column") {
        if (!promptAnswer.value) return;
        addNewColumn();
    } else if (promptTitle.value == "edit-value") {
        if (!promptAnswer.value) return;
        updateEditedValue();
    } else if (promptTitle.value == "edit-key") {
        if (!promptAnswer.value) return;
        updateEditedKey();
    }
    closeModal();
};
const submitOption = async () => {
    if (promptTitle.value == "delete-row") {
        deleteRow();
    } else if (promptTitle.value == "quit") {
        await exit(0);
    }
    closeModal();
};
const clickCell = (text : any, index : number, key : string) => {
    valuesForEdit.value = [];
    valuesForEdit.value.push(text,index,key);
};
const editColumnValue = () => {
    if (valuesForEdit.value.length == 0 || selectedCell.value == null) {
        showNotification("No cell selected!");
        return;
    }
    editValue(valuesForEdit.value[0],valuesForEdit.value[1],valuesForEdit.value[2]);
};
const editValue = (text : any, index : number, key : string) => {
    selectedCell.value = null;
    if (typeof(text) == "object") {
        showNotification("Cannot edit list or dictionaries at the moment.");
        return;
    }
    currentType.value = "string";
    promptTitle.value = "edit-value";
    promptText("Enter the new column value:");
    currentType.value = typeof(text);
    promptAnswer.value = text;
    editKey.value = key;
    editIndex.value = index;
};
const editHeader = (text : any) => {
    promptTitle.value = "edit-key";
    promptText("Enter the new column name:");
    promptAnswer.value = text;
    editKey.value = text;
};
const updateEditedValue = () => {
    var newValue = <any>promptAnswer.value;
    if (currentType.value == "number") {
        if (newValue.includes(".")) {
            newValue = parseFloat(newValue);
        } else {
            newValue = parseInt(newValue);
        }
    } else if (currentType.value == "boolean") {
        if (newValue == "true") {
            newValue = true;
        } else {
            newValue = false;
        }
    }
    rows.value[editIndex.value][editKey.value] = newValue;
    isUnsaved.value = true;
};
const updateEditedKey = () => {
    rows.value = rows.value.map(d => renameKey(d, editKey.value, promptAnswer.value));
    isUnsaved.value = true;
};
const renameKey = (obj : any, oldKey : string, newKey : string) => {
    const newObj = <any>{};
    for (const key of Object.keys(obj)) {
        if (key === oldKey) {
        newObj[newKey] = obj[key];
        } else {
        newObj[key] = obj[key];
        }
    }
    return newObj;
};
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key : string, value : any) => {
        key = key;
        if (value === "" || value === null) {
            return undefined;
        }
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return undefined;
            }
            seen.add(value);
        }
        return value;
    };
};
const saveAsJson = async () => {
    try {
        const baseDir = await downloadDir(); 
        const defaultSavePath = await join(baseDir, 'new-file.json');
        const path = await save({
        filters: [{
            name: 'JSON',
            extensions: ['json']
        }],
        defaultPath: defaultSavePath
        });
        if (path) {
            filename.value = await basename(path);
            filepath.value = path;
            await saveFile(path);
            showNotification("File saved to the file!","seagreen");
        }
    } catch (err) {
        showNotification("Save error:" + err);
    }
};
const saveJson = async () => {
    try {
        if (filepath.value != "") {
            const path = filepath.value;
            await saveFile(path);
        } else {
            saveAsJson();
        }
    } catch (err) {
        showNotification("Save error:" + err);
    }
};
const saveFile = async (path : string) => {
    const content = JSON.stringify(rows.value, getCircularReplacer(), 2)
        .replace(/\r?\n|\r/g, " ")
        .replace(/\s+/g, " ");
    await writeTextFile(path, content);
    isUnsaved.value = false;
};
</script>