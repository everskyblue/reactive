inspired by react but a simpler implementation.

It is a library that was created with the purpose of being agnostic and can be implemented in different projects, both web and native.
It is still in development but it is expected that it can perform well.

It's a slightly different implementation than React since it doesn't re-render
the whole component but rather a small part that handles the application state as a map array
that returns a view array.

## Example

**index.jsx**

```javascript
import { Reactive, addWidget, render, createWidget } from "reactive";
import { App } from "./App";

addWidget(createWidget);
render("#app", <App />);
```

**App.jsx**

```javascript
import { Execute, Reactive, useState } from "reactive";

function mapUserState({ state: usersState }) {
    return usersState.map((user) => {
        return (
            <div class="section" id={user.id}>
                <h5>{user.name}</h5>
                <p>{user.email}</p>
            </div>
        );
    });
}

function User({ name }) {
    const users = useState([]);
    const change = useState("this is my state");

    const loadUser = async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        users.set(await res.json());
    };

    return (
        <section class="section">
            <h6 onClick={() => change.set("changed!")}>
                created by {name} - press to change state <b>{change}</b>
            </h6>
            <button
                type="button"
                class="waves-effect waves-light btn"
                onClick={loadUser}
            >
                load users
            </button>
            <div class="content">
                <Execute callback={mapUserState} state={users} />
            </div>
        </section>
    );
}

export function App() {
    return (
        <div class="container">
            <h1>Welcome Reactive</h1>
            <User name="everskyblue(hicode)" />
        </div>
    );
}
```

[api documentation](https://everskyblue.github.io/reactive)
