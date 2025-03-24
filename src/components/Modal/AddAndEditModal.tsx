import React, { ReactNode, useState } from 'react';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '../../components/bootstrap/Modal';
import { TModalFullScreen, TModalSize } from '../../type/modal-type';
import Button from '../../components/bootstrap/Button';
import contents from '../../routes/contentRoutes';

interface ModelProps {
    nameButton: string;
    content: ReactNode;
    title: string;
}


const AddAndEditModal: React.FC<ModelProps> = ({ nameButton, content, title }) => {
    const [state, setState] = useState(false);

    const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
    const [scrollableStatus, setScrollableStatus] = useState(false);
    const [centeredStatus, setCenteredStatus] = useState(false);
    const [sizeStatus, setSizeStatus] = useState<TModalSize>(null);
    const [fullScreenStatus, setFullScreenStatus] = useState<TModalFullScreen | undefined>(
        undefined,
    );
    const [animationStatus, setAnimationStatus] = useState(true);
    const [longContentStatus, setLongContentStatus] = useState(false);
    const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

    const initialStatus = () => {
        setStaticBackdropStatus(false);
        setScrollableStatus(false);
        setCenteredStatus(false);
        setSizeStatus(null);
        setFullScreenStatus(undefined);
        setAnimationStatus(true);
        setLongContentStatus(false);
        setHeaderCloseStatus(true);
    };
    return (
        <>

            <Button
                className='btn btn-outline-info border-transparent btn-hover-shadow-lg shadow-none'
                isLight
                icon='Add'
                onClick={() => {
                    initialStatus();
                    setAnimationStatus(false);
                    setCenteredStatus(true);
                    setSizeStatus('lg');
                    setState(true);
                    setState(true);
                }}>
                {nameButton}
            </Button>
            <Modal
                isOpen={state}
                setIsOpen={setState}
                titleId='exampleModalLabel'
                isStaticBackdrop={staticBackdropStatus}
                isScrollable={scrollableStatus}
                isCentered={centeredStatus}
                size={sizeStatus}
                fullScreen={fullScreenStatus}
                isAnimation={animationStatus}>
                <ModalHeader setIsOpen={headerCloseStatus ? setState : undefined}>
                    <ModalTitle id='exampleModalLabel'>{title}</ModalTitle>
                </ModalHeader>
                <ModalBody>{content}</ModalBody>
                <ModalFooter>
                    <Button color='info' icon='Save'>
                        Cất giữ
                    </Button>
                    <Button color='success' icon='Save'>
                        Thêm tiếp
                    </Button>
                    <Button
                        color='info'
                        isOutline
                        className='border-0'
                        onClick={() => setState(false)}>
                        Đóng
                    </Button>

                </ModalFooter>
            </Modal>
        </>

    );
}

export default AddAndEditModal;