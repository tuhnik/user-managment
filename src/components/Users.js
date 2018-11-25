import React, { Component } from 'react';
import { Menu, Icon, Table, Button, Confirm, Pagination } from 'semantic-ui-react';
import DetailView from './DetailView';

class Users extends Component {

    state = {
        data: null,
        error: '',
        delConfirmOpen: false,
        itemToDelete: '',
        detailView: false,
        itemToView: '',
        total: 0,
        activePage: 1
    }

    componentDidMount = () => {
        this.props.getUsers();
    }

    componentDidUpdate = (prevProps) => {
        if (this.props !== prevProps) {
            this.setState({ data: this.props.data, total: this.props.total, activePage: this.props.activePage });
        }
    }

    deleteUser = () => {
        this.props.deleteUser(this.state.itemToDelete);
        this.closeDelConfirm();
    }

    pageChanged = (e, data) => {
        this.props.changeActivePage(data.activePage)
    }

    openDelConfirm = id => this.setState({ delConfirmOpen: true, itemToDelete: id })

    closeDelConfirm = () => this.setState({ delConfirmOpen: false, itemToDelete: '' })

    openDetailView = logins => this.setState({ detailView: true, itemToView: logins })

    closeDetailView = () => this.setState({ detailView: false, itemToView: '' })

    render() {
        const { total, data, delConfirmOpen, detailView, itemToView } = this.state
        return (
            <>
                <DetailView shown={detailView} close={this.closeDetailView} data={itemToView} />
                <Menu>
                    <Menu.Menu>
                        <Menu.Item
                            name='adduser'
                            content='Add user'
                            onClick={this.props.addUser}
                        />
                    </Menu.Menu>
                    <Menu.Menu position="right">
                        <Menu.Item
                            name='logout'
                            content='Log out'
                            onClick={this.props.logOut}
                        />
                    </Menu.Menu>
                </Menu>
                <Table singleLine>
                    <Confirm open={delConfirmOpen} onCancel={this.closeDelConfirm} onConfirm={this.deleteUser} />
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{"Total users: " + total}</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data && data.map((el, i) => {
                            return <Table.Row key={i}>
                                <Table.Cell>{el.email}</Table.Cell>
                                <Table.Cell textAlign="right">
                                    <Button icon onClick={() => this.openDetailView(el)}> <Icon name='eye' /></Button>
                                    <Button icon onClick={() => this.openDelConfirm(el.id)}> <Icon name='delete' /></Button>
                                </Table.Cell>
                            </Table.Row>;
                        })}
                    </Table.Body>
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>
                                <Pagination
                                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    activePage={this.state.activePage}
                                    floated="right"
                                    onPageChange={this.pageChanged}
                                    totalPages={Math.ceil(total / 5)} />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </>
        );
    }
}

export default Users;
