import { appendChild, createComponent, createInjector, elem, insert, mountBlock, mountComponent, propsSet, setAttribute, unmountBlock, unmountComponent, updateBlock, updateIncomingSlot } from "endorphin";
import * as MyComponent1 from "./my-component1.html";
import * as MyComponent2 from "./my-component2.html";
import * as InnerComponent from "./inner-component.html";

let slots = [0, 0];
const slotsStack = [];

function enterSlots() {
	slotsStack.push(slots);
	slots = [0, 0];
}

function exitSlots() {
	slots = slotsStack.pop();
}

function ifBody$0(host, injector) {
	insert(injector, elem("header"), "");
	slots[0] = 1;
}

ifBody$0.dispose = ifBody$0Unmount;

function ifBody$0Unmount() {
	slots[0] = 1;
}

function ifEntry$0(host) {
	return host.props.enabled ? ifBody$0 : null;
}

function ifBody$1(host, injector) {
	insert(injector, elem("blockquote"));
	slots[1] = 1;
}

ifBody$1.dispose = ifBody$1Unmount;

function ifBody$1Unmount() {
	slots[1] = 1;
}

function ifEntry$1(host) {
	return host.props.enabled ? ifBody$1 : null;
}

export default function template$0(host, scope) {
	const target$0 = host.componentView;
	enterSlots();
	const myComponent1$0 = scope.myComponent1$0 = appendChild(target$0, createComponent("my-component1", MyComponent1, host));
	const inj$0 = myComponent1$0.componentModel.input;
	scope.if$0 = mountBlock(host, inj$0, ifEntry$0);
	const myComponent2$0 = scope.myComponent2$0 = insert(inj$0, createComponent("my-component2", MyComponent2, host), "header");
	const inj$1 = myComponent2$0.componentModel.input;
	const innerComponent$0 = scope.innerComponent$0 = insert(inj$1, createComponent("inner-component", InnerComponent, host), "");
	mountComponent(innerComponent$0);
	mountComponent(myComponent2$0, propsSet(myComponent2$0, {slot: "header"}));
	const div$0 = insert(inj$0, elem("div"), "footer");
	const inj$2 = createInjector(div$0);
	setAttribute(div$0, "slot", "footer");
	scope.if$1 = mountBlock(host, inj$2, ifEntry$1);
	mountComponent(myComponent1$0);
	exitSlots();
	return template$0Update;
}

template$0.dispose = template$0Unmount;

function template$0Update(host, scope) {
	const { myComponent1$0 } = scope;
	enterSlots();
	updateBlock(scope.if$0);
	updateBlock(scope.if$1);
	updateIncomingSlot(myComponent1$0, "", slots[0]);
	updateIncomingSlot(myComponent1$0, "footer", slots[1]);
	exitSlots();
}

function template$0Unmount(scope) {
	enterSlots();
	scope.if$0 = unmountBlock(scope.if$0);
	scope.innerComponent$0 = unmountComponent(scope.innerComponent$0);
	scope.myComponent2$0 = unmountComponent(scope.myComponent2$0);
	scope.if$1 = unmountBlock(scope.if$1);
	scope.myComponent1$0 = unmountComponent(scope.myComponent1$0);
	exitSlots();
}