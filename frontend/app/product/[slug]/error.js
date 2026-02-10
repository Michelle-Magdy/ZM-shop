"use client";

export default function Error({ error, reset }) {
    console.error(error);

    return (
        <div style={{ padding: 40 }}>
            <h2>Something went wrong loading this product</h2>
            <button onClick={() => reset()}>
                Try again
            </button>
        </div>
    );
}
