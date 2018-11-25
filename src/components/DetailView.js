import React from "react";
import { Button, Header, Modal, List, Icon } from "semantic-ui-react";

const DetailView = props => (
  <Modal open={props.shown} onClose={props.close}>
    <Header icon="archive" content={props.data.email + " - last logins"} />
    <Modal.Content>
      <List divided relaxed>
        {props.data.logins && !props.data.logins.length && (
          <div>This user has not logged in yet.</div>
        )}
        {props.data.logins &&
          props.data.logins.map((el, i) => {
            return (
              <List.Item key={i}>
                <List.Icon name="log out" size="small" verticalAlign="middle" />
                <List.Content>{el}</List.Content>
              </List.Item>
            );
          })}
      </List>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={props.close} color="red">
        <Icon name="remove" /> Close
      </Button>
    </Modal.Actions>
  </Modal>
);

export default DetailView;
